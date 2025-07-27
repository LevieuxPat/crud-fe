/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Users, Activity, LogOut } from "lucide-react";
import { Patient, PatientInput } from "@/types/patient";
import { patientApi } from "@/services/api";
import PatientCard from "@/components/PatientCard";
import PatientForm from "@/components/PatientForm";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { logout, user } = useAuth();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientApi.getAll();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError(
        "Failed to load patients. Please check if the API server is running."
      );
      console.error("Error loading patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (patientData: PatientInput) => {
    try {
      setFormLoading(true);
      const newPatient = await patientApi.create(patientData);
      setPatients([...patients, newPatient]);
      setShowForm(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add patient");
      console.error("Error adding patient:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdatePatient = async (patientData: PatientInput) => {
    if (!editingPatient) return;

    try {
      setFormLoading(true);
      const updatedPatient = await patientApi.update(
        editingPatient.id,
        patientData
      );
      setPatients(
        patients.map((p) => (p.id === editingPatient.id ? updatedPatient : p))
      );
      setEditingPatient(null);
      setShowForm(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update patient");
      console.error("Error updating patient:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePatient = async (id: number) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    try {
      await patientApi.delete(id);
      setPatients(patients.filter((p) => p.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete patient");
      console.error("Error deleting patient:", err);
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const stats = {
    total: patients.length,
    male: patients.filter((p) => p.gender === "Male").length,
    female: patients.filter((p) => p.gender === "Female").length,
    other: patients.filter((p) => p.gender === "Other").length,
  };

  if (showForm) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <PatientForm
            patient={editingPatient || undefined}
            onSubmit={editingPatient ? handleUpdatePatient : handleAddPatient}
            onCancel={handleCancelForm}
            isLoading={formLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Patient Management Dashboard
              </h1>
              <p className='mt-1 text-sm text-gray-500'>
                Manage patient information and medical records
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-900'>
                  {user?.name}
                </p>
                <p className='text-xs text-gray-500'>{user?.email}</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                <Plus className='w-4 h-4 mr-2' />
                Add Patient
              </button>
              <button
                onClick={handleLogout}
                className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                <LogOut className='w-4 h-4 mr-2' />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <Users className='h-6 w-6 text-gray-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-700 truncate'>
                      Total Patients
                    </dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {stats.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <Activity className='h-6 w-6 text-blue-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-700 truncate'>
                      Male
                    </dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {stats.male}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <Activity className='h-6 w-6 text-pink-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-700 truncate'>
                      Female
                    </dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {stats.female}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <Activity className='h-6 w-6 text-purple-400' />
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-700 truncate'>
                      Other
                    </dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {stats.other}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='mb-6 bg-red-50 border border-red-200 rounded-md p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-red-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>Error</h3>
                <div className='mt-2 text-sm text-red-700'>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className='text-center py-12'>
            <div className='inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed'>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
              Loading patients...
            </div>
          </div>
        ) : patients.length === 0 ? (
          /* Empty State */
          <div className='text-center py-12'>
            <Users className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-2 text-sm font-medium text-gray-900'>
              No patients
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Get started by creating a new patient.
            </p>
            <div className='mt-6'>
              <button
                onClick={() => setShowForm(true)}
                className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                <Plus className='w-4 h-4 mr-2' />
                Add Patient
              </button>
            </div>
          </div>
        ) : (
          /* Patient Grid */
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
