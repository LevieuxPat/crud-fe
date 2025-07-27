"use client";

import {Patient, PatientInput} from "@/types/patient";
import {zodResolver} from "@hookform/resolvers/zod";

import {useState} from "react";

import {Plus, X} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";

const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z
    .number()
    .min(0, "Age must be at least 0")
    .max(150, "Age must be at most 150"),
  gender: z.enum(["Male", "Female", "Other"]),
  medicalHistory: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  emergencyContact: z
    .object({
      name: z.string().min(1, "Emergency contact name is required"),
      relationship: z.string().min(1, "Relationship is required"),
      phone: z.string().min(1, "Phone number is required"),
    })
    .optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: PatientInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PatientForm({
  patient,
  onSubmit,
  onCancel,
  isLoading,
}: PatientFormProps) {
  const [medicalHistory, setMedicalHistory] = useState<string[]>(
    patient?.medicalHistory || []
  );
  const [allergies, setAllergies] = useState<string[]>(
    patient?.allergies || []
  );
  const [medications, setMedications] = useState<string[]>(
    patient?.medications || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: patient?.name || "",
      age: patient?.age || 0,
      gender: patient?.gender || "Male",
      medicalHistory: patient?.medicalHistory || [],
      allergies: patient?.allergies || [],
      medications: patient?.medications || [],
      emergencyContact: patient?.emergencyContact || {
        name: "",
        relationship: "",
        phone: "",
      },
    },
  });

  const addItem = (
    array: string[],
    setArray: (items: string[]) => void,
    item: string
  ) => {
    if (item.trim() && !array.includes(item.trim())) {
      setArray([...array, item.trim()]);
    }
  };

  const removeItem = (
    array: string[],
    setArray: (items: string[]) => void,
    index: number
  ) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: PatientFormData) => {
    onSubmit({
      ...data,
      medicalHistory,
      allergies,
      medications,
    });
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6 text-gray-900'>
        {patient ? "Edit Patient" : "Add New Patient"}
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
        {/* Basic Information */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-900 mb-1'>
              Name *
            </label>
            <input
              {...register("name")}
              type='text'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
              placeholder='Enter full name'
            />
            {errors.name && (
              <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-900 mb-1'>
              Age *
            </label>
            <input
              {...register("age", { valueAsNumber: true })}
              type='number'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
              placeholder='Age'
            />
            {errors.age && (
              <p className='text-red-500 text-sm mt-1'>{errors.age.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-900 mb-1'>
              Gender *
            </label>
            <select
              {...register("gender")}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900'>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Other'>Other</option>
            </select>
            {errors.gender && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>

        {/* Medical History */}
        <div>
          <label className='block text-sm font-medium text-gray-900 mb-2'>
            Medical History
          </label>
          <div className='flex gap-2 mb-2'>
            <input
              type='text'
              placeholder='Add medical condition'
              className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  addItem(medicalHistory, setMedicalHistory, target.value);
                  target.value = "";
                }
              }}
            />
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault();
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                addItem(medicalHistory, setMedicalHistory, input.value);
                input.value = "";
              }}
              className='px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
              <Plus className='w-4 h-4' />
            </button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {medicalHistory.map((item, index) => (
              <span
                key={index}
                className='px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-1'>
                {item}
                <button
                  type='button'
                  onClick={() =>
                    removeItem(medicalHistory, setMedicalHistory, index)
                  }
                  className='text-red-600 hover:text-red-800'>
                  <X className='w-3 h-3' />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className='block text-sm font-medium text-gray-900 mb-2'>
            Allergies
          </label>
          <div className='flex gap-2 mb-2'>
            <input
              type='text'
              placeholder='Add allergy'
              className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  addItem(allergies, setAllergies, target.value);
                  target.value = "";
                }
              }}
            />
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault();
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                addItem(allergies, setAllergies, input.value);
                input.value = "";
              }}
              className='px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
              <Plus className='w-4 h-4' />
            </button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {allergies.map((item, index) => (
              <span
                key={index}
                className='px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center gap-1'>
                {item}
                <button
                  type='button'
                  onClick={() => removeItem(allergies, setAllergies, index)}
                  className='text-yellow-600 hover:text-yellow-800'>
                  <X className='w-3 h-3' />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Medications */}
        <div>
          <label className='block text-sm font-medium text-gray-900 mb-2'>
            Current Medications
          </label>
          <div className='flex gap-2 mb-2'>
            <input
              type='text'
              placeholder='Add medication'
              className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  addItem(medications, setMedications, target.value);
                  target.value = "";
                }
              }}
            />
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault();
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                addItem(medications, setMedications, input.value);
                input.value = "";
              }}
              className='px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
              <Plus className='w-4 h-4' />
            </button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {medications.map((item, index) => (
              <span
                key={index}
                className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1'>
                {item}
                <button
                  type='button'
                  onClick={() => removeItem(medications, setMedications, index)}
                  className='text-green-600 hover:text-green-800'>
                  <X className='w-3 h-3' />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className='border-t pt-6'>
          <h3 className='text-lg font-medium mb-4 text-gray-900'>
            Emergency Contact
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-1'>
                Name
              </label>
              <input
                {...register("emergencyContact.name")}
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
                placeholder='Contact name'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-1'>
                Relationship
              </label>
              <input
                {...register("emergencyContact.relationship")}
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
                placeholder='e.g., Spouse, Parent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-1'>
                Phone
              </label>
              <input
                {...register("emergencyContact.phone")}
                type='tel'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
                placeholder='Phone number'
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className='flex justify-end space-x-4 pt-6 border-t'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'>
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
            {isLoading
              ? "Saving..."
              : patient
              ? "Update Patient"
              : "Add Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}
