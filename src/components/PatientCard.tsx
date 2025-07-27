"use client";

import { Patient } from "@/types/patient";

import { Edit, Phone, Trash2, User } from "lucide-react";

interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
}

export default function PatientCard({
  patient,
  onEdit,
  onDelete,
}: PatientCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
      <div className='flex justify-between items-start mb-4'>
        <div className='flex items-center space-x-2'>
          <User className='w-5 h-5 text-blue-600' />
          <h3 className='text-xl font-semibold text-gray-900'>
            {patient.name}
          </h3>
        </div>
        <div className='flex space-x-2'>
          <button
            onClick={() => onEdit(patient)}
            className='p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors'
            title='Edit patient'>
            <Edit className='w-4 h-4' />
          </button>
          <button
            onClick={() => onDelete(patient.id)}
            className='p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors'
            title='Delete patient'>
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div>
          <p className='text-sm text-gray-700'>Age</p>
          <p className='font-medium text-gray-900'>{patient.age} years</p>
        </div>
        <div>
          <p className='text-sm text-gray-700'>Gender</p>
          <p className='font-medium text-gray-900'>{patient.gender}</p>
        </div>
      </div>

      {patient.medicalHistory.length > 0 && (
        <div className='mb-4'>
          <p className='text-sm text-gray-700 mb-1'>Medical History</p>
          <div className='flex flex-wrap gap-1'>
            {patient.medicalHistory.map((condition, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full'>
                {condition}
              </span>
            ))}
          </div>
        </div>
      )}

      {patient.allergies.length > 0 && (
        <div className='mb-4'>
          <p className='text-sm text-gray-700 mb-1'>Allergies</p>
          <div className='flex flex-wrap gap-1'>
            {patient.allergies.map((allergy, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'>
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {patient.medications.length > 0 && (
        <div className='mb-4'>
          <p className='text-sm text-gray-700 mb-1'>Current Medications</p>
          <div className='flex flex-wrap gap-1'>
            {patient.medications.map((medication, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                {medication}
              </span>
            ))}
          </div>
        </div>
      )}

      {patient.emergencyContact && (
        <div className='border-t pt-4'>
          <div className='flex items-center space-x-2 mb-2'>
            <Phone className='w-4 h-4 text-gray-500' />
            <p className='text-sm text-gray-700'>Emergency Contact</p>
          </div>
          <p className='font-medium text-sm text-gray-900'>
            {patient.emergencyContact.name}
          </p>
          <p className='text-sm text-gray-700'>
            {patient.emergencyContact.relationship}
          </p>
          <p className='text-sm text-gray-700'>
            {patient.emergencyContact.phone}
          </p>
        </div>
      )}

      <div className='mt-4 pt-4 border-t'>
        <p className='text-xs text-gray-400'>
          Created: {formatDate(patient.createdAt)}
        </p>
      </div>
    </div>
  );
}
