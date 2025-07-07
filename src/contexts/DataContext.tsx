import React, { createContext, useContext, useState, useEffect } from 'react';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  location?: string;
  category: 'family' | 'friend' | 'police' | 'medical' | 'other';
}

export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'travel' | 'digital' | 'home' | 'workplace';
  tags: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface PoliceStation {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number];
  phone: string;
  address: string;
  available24x7: boolean;
}

interface DataContextType {
  emergencyContacts: EmergencyContact[];
  safetyTips: SafetyTip[];
  policeStations: PoliceStation[];
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
  updateEmergencyContact: (id: string, contact: Partial<EmergencyContact>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [safetyTips] = useState<SafetyTip[]>([
    {
      id: '1',
      title: 'Trust Your Instincts',
      content: 'If a situation feels wrong, trust your gut feeling. Your instincts are your first line of defense.',
      category: 'personal',
      tags: ['intuition', 'awareness'],
      priority: 'high'
    },
    {
      id: '2',
      title: 'Share Your Location',
      content: 'Always share your live location with trusted contacts when traveling alone, especially at night.',
      category: 'travel',
      tags: ['location', 'travel', 'night'],
      priority: 'high'
    },
    {
      id: '3',
      title: 'Use Strong Passwords',
      content: 'Create unique, strong passwords for all accounts and enable two-factor authentication.',
      category: 'digital',
      tags: ['passwords', 'security', '2fa'],
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Stay Alert in Public',
      content: 'Avoid using headphones at full volume and stay aware of your surroundings in public spaces.',
      category: 'personal',
      tags: ['awareness', 'public', 'attention'],
      priority: 'high'
    },
    {
      id: '5',
      title: 'Home Security Check',
      content: 'Regularly check locks, peepholes, and security systems. Never open doors to strangers.',
      category: 'home',
      tags: ['home', 'locks', 'strangers'],
      priority: 'medium'
    },
    {
      id: '6',
      title: 'Workplace Safety',
      content: 'Report inappropriate behavior immediately and document incidents. Know your workplace policies.',
      category: 'workplace',
      tags: ['harassment', 'documentation', 'reporting'],
      priority: 'high'
    }
  ]);

  const [policeStations] = useState<PoliceStation[]>([
    {
      id: '1',
      name: 'Connaught Place Police Station',
      district: 'New Delhi',
      coordinates: [28.6315, 77.2167],
      phone: '011-23412345',
      address: 'Block A, Connaught Place, New Delhi - 110001',
      available24x7: true
    },
    {
      id: '2',
      name: 'Karol Bagh Police Station',
      district: 'New Delhi',
      coordinates: [28.6519, 77.1909],
      phone: '011-25752345',
      address: 'Karol Bagh, New Delhi - 110005',
      available24x7: true
    },
    {
      id: '3',
      name: 'Lajpat Nagar Police Station',
      district: 'South Delhi',
      coordinates: [28.5665, 77.2431],
      phone: '011-29831234',
      address: 'Lajpat Nagar, New Delhi - 110024',
      available24x7: false
    },
    {
      id: '4',
      name: 'Dwarka Police Station',
      district: 'South West Delhi',
      coordinates: [28.5921, 77.0460],
      phone: '011-25081234',
      address: 'Sector 9, Dwarka, New Delhi - 110077',
      available24x7: true
    },
    {
      id: '5',
      name: 'Rohini Police Station',
      district: 'North West Delhi',
      coordinates: [28.7041, 77.1025],
      phone: '011-27051234',
      address: 'Sector 3, Rohini, Delhi - 110085',
      available24x7: true
    }
  ]);

  useEffect(() => {
    // Load emergency contacts from localStorage
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    } else {
      // Default emergency contacts
      const defaultContacts: EmergencyContact[] = [
        {
          id: '1',
          name: 'Women Helpline',
          phone: '1091',
          relationship: 'Emergency Service',
          category: 'police'
        },
        {
          id: '2',
          name: 'Police Emergency',
          phone: '100',
          relationship: 'Emergency Service',
          category: 'police'
        },
        {
          id: '3',
          name: 'Medical Emergency',
          phone: '108',
          relationship: 'Emergency Service',
          category: 'medical'
        }
      ];
      setEmergencyContacts(defaultContacts);
    }
  }, []);

  const saveContacts = (contacts: EmergencyContact[]) => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = { ...contact, id: Date.now().toString() };
    const updatedContacts = [...emergencyContacts, newContact];
    setEmergencyContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  const removeEmergencyContact = (id: string) => {
    const updatedContacts = emergencyContacts.filter(contact => contact.id !== id);
    setEmergencyContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  const updateEmergencyContact = (id: string, updatedContact: Partial<EmergencyContact>) => {
    const updatedContacts = emergencyContacts.map(contact =>
      contact.id === id ? { ...contact, ...updatedContact } : contact
    );
    setEmergencyContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  return (
    <DataContext.Provider value={{
      emergencyContacts,
      safetyTips,
      policeStations,
      addEmergencyContact,
      removeEmergencyContact,
      updateEmergencyContact
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}