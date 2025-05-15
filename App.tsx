import { useState } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useQuery } from "convex/react";
import { Map } from "./Map";
import { AddContactModal } from "./AddContactModal";
import { Search, UserPlus } from "lucide-react";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contacts = useQuery(api.contacts.search, { searchQuery }) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Realtor Visualizer</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 flex flex-col">
        <Authenticated>
          <div className="p-4 flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <UserPlus size={20} />
              Add Realtor
            </button>
          </div>
          <Map contacts={contacts} />
          <AddContactModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Authenticated>
        <Unauthenticated>
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Realtor Visualizer</h1>
                <p className="text-xl text-gray-600">
                  Sign in to manage and visualize your realtor network
                </p>
              </div>
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>
      </main>
      <Toaster />
    </div>
  );
}
