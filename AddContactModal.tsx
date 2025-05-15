import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { X } from "lucide-react";

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddContactModal({ isOpen, onClose }: AddContactModalProps) {
  const createContact = useMutation(api.contacts.create);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    serviceAreaType: "city",
    serviceAreaValue: "",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createContact(formData);
      toast.success("Contact added successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to add contact");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Realtor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            className="w-full p-2 border rounded"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <select
            className="w-full p-2 border rounded"
            value={formData.serviceAreaType}
            onChange={(e) =>
              setFormData({ ...formData, serviceAreaType: e.target.value as any })
            }
          >
            <option value="city">City</option>
            <option value="county">County</option>
            <option value="state">State</option>
          </select>
          <input
            type="text"
            placeholder="Service Area (e.g., Phoenix, Arizona)"
            className="w-full p-2 border rounded"
            value={formData.serviceAreaValue}
            onChange={(e) =>
              setFormData({ ...formData, serviceAreaValue: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Notes"
            className="w-full p-2 border rounded"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Contact
          </button>
        </form>
      </div>
    </div>
  );
}
