export const mockServices = [
  {
    id: 1,
    name: 'Electrician Services',
    icon: 'lightning-charge',
    count: '320+ verified',
    price: 499,
    rating: 4.9,
    category: 'Electrician',
    description: 'Electrical wiring, fuse repair, switchboard installation, light fixture setup.',
    colorBg: '#FEF3C7',
    colorText: '#D97706'
  },
  {
    id: 2,
    name: 'Plumbing Repair',
    icon: 'droplet',
    count: '210+ verified',
    price: 399,
    rating: 4.8,
    category: 'Plumber',
    description: 'Pipe leakage repair, blockage clearance, tap/shower fitting, drain cleaning.',
    colorBg: '#DBEAFE',
    colorText: '#2563EB'
  },
  {
    id: 3,
    name: 'AC Repair & Servicing',
    icon: 'snow',
    count: '180+ verified',
    price: 899,
    rating: 4.9,
    category: 'AC Repair',
    description: 'Deep AC jet cleaning, Freon gas top-up, compressor check, split/window servicing.',
    colorBg: '#E0F2FE',
    colorText: '#0284C7'
  },
  {
    id: 4,
    name: 'Deep Home Cleaning',
    icon: 'stars',
    count: '390+ verified',
    price: 1499,
    rating: 4.7,
    category: 'Cleaning',
    description: 'Full house deep scrubbing, kitchen degreasing, bathroom sanitization, balcony wash.',
    colorBg: '#DCFCE7',
    colorText: '#16A34A'
  },
  {
    id: 5,
    name: 'Appliance Repair',
    icon: 'tools',
    count: '140+ verified',
    price: 599,
    rating: 4.8,
    category: 'Appliance Repair',
    description: 'RO purifier servicing, washing machine repair, refrigerator cooling check.',
    colorBg: '#F3E8FF',
    colorText: '#9333EA'
  },
  {
    id: 6,
    name: 'Carpentry & Furniture Repair',
    icon: 'hammer',
    count: '95+ verified',
    price: 450,
    rating: 4.6,
    category: 'Carpentry',
    description: 'Door lock fitting, furniture assembly, cabinet repair, wooden table polish.',
    colorBg: '#FFEDD5',
    colorText: '#EA580C'
  },
  {
    id: 7,
    name: 'CCTV & Security Systems',
    icon: 'shield-check',
    count: '60+ verified',
    price: 999,
    rating: 4.9,
    category: 'Security Systems',
    description: 'CCTV camera installation, biometric lock setup, smart door bell wiring.',
    colorBg: '#FEE2E2',
    colorText: '#DC2626'
  },
  {
    id: 8,
    name: 'Pest Control Treatment',
    icon: 'bug',
    count: '110+ verified',
    price: 1299,
    rating: 4.8,
    category: 'Pest Control',
    description: 'Eco-friendly cockroach gel treatment, termite protection, bedbug spray.',
    colorBg: '#D1FAE5',
    colorText: '#059669'
  }
];

export const mockProviders = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Master Electrician',
    category: 'Electrician',
    location: 'Andheri East, Mumbai',
    rating: 4.9,
    jobsCompleted: 342,
    trustScore: 97,
    available: true,
    experience: '8 Years',
    phone: '+91 98200 11223',
    img: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=faces',
    verified: true,
    bio: 'Certified electrician specializing in residential emergency wiring and heavy power load management.',
    reviewsCount: 128
  },
  {
    id: 2,
    name: 'Priya Mehta',
    role: 'HVAC & AC Specialist',
    category: 'AC Repair',
    location: 'Koramangala, Bangalore',
    rating: 4.8,
    jobsCompleted: 218,
    trustScore: 95,
    available: true,
    experience: '5 Years',
    phone: '+91 98200 44556',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces',
    verified: true,
    bio: 'Expert in invertor AC servicing, copper pipe fitting, and environmental cooling systems.',
    reviewsCount: 94
  },
  {
    id: 3,
    name: 'Arjun Patel',
    role: 'Senior Plumbing Engineer',
    category: 'Plumber',
    location: 'Sector 22, Noida',
    rating: 4.7,
    jobsCompleted: 189,
    trustScore: 93,
    available: false,
    experience: '6 Years',
    phone: '+91 98200 77889',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    verified: true,
    bio: 'High precision plumbing fixes, hydro-jetting blockage clearing, and bathroom fittings.',
    reviewsCount: 81
  },
  {
    id: 4,
    name: 'Sandeep Kumar',
    role: 'Sanitization & Deep Clean Lead',
    category: 'Cleaning',
    location: 'Powai, Mumbai',
    rating: 4.9,
    jobsCompleted: 412,
    trustScore: 98,
    available: true,
    experience: '7 Years',
    phone: '+91 98200 99001',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
    verified: true,
    bio: 'Leading eco-friendly deep home cleaning teams using German equipment and non-toxic chemicals.',
    reviewsCount: 165
  }
];

export const mockBookings = [
  {
    id: 'FM-2841',
    serviceName: 'Master Electrical Repair & Wiring',
    category: 'Electrician',
    providerName: 'Rahul Sharma',
    providerPhone: '+91 98200 11223',
    date: '2026-08-10',
    time: '10:00 AM',
    status: 'In Progress',
    emergency: true,
    amount: 499,
    address: 'Flat 402, Green Valley Society, Andheri East, Mumbai'
  },
  {
    id: 'FM-2799',
    serviceName: 'AC Deep Cleaning & Gas Refill',
    category: 'AC Repair',
    providerName: 'Priya Mehta',
    providerPhone: '+91 98200 44556',
    date: '2026-08-08',
    time: '02:30 PM',
    status: 'Accepted',
    emergency: false,
    amount: 899,
    address: 'Flat 402, Green Valley Society, Andheri East, Mumbai'
  },
  {
    id: 'FM-2754',
    serviceName: 'Emergency Plumbing Repair',
    category: 'Plumber',
    providerName: 'Arjun Patel',
    providerPhone: '+91 98200 77889',
    date: '2026-08-02',
    time: '11:00 AM',
    status: 'Completed',
    emergency: true,
    amount: 399,
    address: 'Flat 402, Green Valley Society, Andheri East, Mumbai'
  }
];

export const mockReminders = [
  {
    id: 1,
    service: 'AC Jet Servicing',
    dueDate: '2026-08-15',
    daysLeft: 8,
    status: 'Upcoming',
    category: 'AC Repair',
    recommendedFrequency: 'Every 6 Months'
  },
  {
    id: 2,
    service: 'RO Water Purifier Filter Change',
    dueDate: '2026-08-30',
    daysLeft: 23,
    status: 'Upcoming',
    category: 'Appliance Repair',
    recommendedFrequency: 'Every 4 Months'
  },
  {
    id: 3,
    service: 'Society Pest Control Spray',
    dueDate: '2026-07-20',
    daysLeft: -18,
    status: 'Overdue',
    category: 'Pest Control',
    recommendedFrequency: 'Every 3 Months'
  }
];

export const mockSocietyBookings = [
  {
    id: 101,
    societyName: 'Green Valley Society, Andheri',
    service: 'Eco Pest Control & Termite Spray',
    joinedResidents: 14,
    targetDiscount: '20% OFF',
    date: '2026-08-20',
    originalPrice: 1299,
    groupPrice: 1039,
    status: 'Active Group'
  },
  {
    id: 102,
    societyName: 'Sunrise Heights, Powai',
    service: 'Full Apartment Deep Scrubbing',
    joinedResidents: 8,
    targetDiscount: '15% OFF',
    date: '2026-08-25',
    originalPrice: 1499,
    groupPrice: 1274,
    status: 'Active Group'
  }
];

export const mockTeamMembers = [
  { name: 'Shabina Khan', role: 'Group Member' },
  { name: 'Shankar Sala', role: 'Group Member' },
  { name: 'Siddhi Patil', role: 'Group Member' },
  { name: 'Sumit Shelar', role: 'Group Member' }
];
