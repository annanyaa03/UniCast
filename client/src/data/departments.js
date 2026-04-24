import { Cpu, Database, Brain, Wifi, Zap, Settings } from 'lucide-react';

export const DEPARTMENTS = [
  {
    slug: 'computer',
    name: 'Computer Engineering',
    shortName: 'COMPUTER',
    icon: Cpu,
    description: 'Department of Computer Engineering and Information Technology. Focus on software, AI,...',
    fullDescription: 'The Computer Engineering department covers data structures, algorithms, operating systems, computer networks, software engineering, artificial intelligence, machine learning, and full stack web development. Students build real world projects and contribute to open source.',
    courses: 12,
    videos: 148,
    members: 320,
    established: 2001,
    head: 'Dr. Rajesh Sharma',
    location: 'Block A, Floor 3',
    email: 'comp@college.edu',
    topics: ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks', 'AI', 'Machine Learning', 'Web Development', 'Database Systems'],
    semesters: [
      {
        sem: 1,
        courses: [
          { code: 'CS101', name: 'Engineering Mathematics', professor: 'Dr. Sharma', videos: 12 },
          { code: 'CS102', name: 'Programming Fundamentals', professor: 'Dr. Mehta', videos: 18 },
          { code: 'CS103', name: 'Digital Logic Design', professor: 'Dr. Joshi', videos: 10 },
        ]
      },
      {
        sem: 2,
        courses: [
          { code: 'CS201', name: 'Data Structures', professor: 'Dr. Sharma', videos: 22 },
          { code: 'CS202', name: 'Computer Organization', professor: 'Dr. Patil', videos: 16 },
          { code: 'CS203', name: 'Discrete Mathematics', professor: 'Dr. Nair', videos: 14 },
        ]
      },
      {
        sem: 3,
        courses: [
          { code: 'CS301', name: 'Algorithms', professor: 'Dr. Mehta', videos: 20 },
          { code: 'CS302', name: 'Operating Systems', professor: 'Dr. Sharma', videos: 18 },
          { code: 'CS303', name: 'Database Management', professor: 'Dr. Joshi', videos: 15 },
        ]
      },
    ],
    faculty: [
      { name: 'Dr. Rajesh Sharma', designation: 'Head of Department', specialty: 'Artificial Intelligence', email: 'r.sharma@college.edu' },
      { name: 'Dr. Priya Mehta', designation: 'Associate Professor', specialty: 'Machine Learning', email: 'p.mehta@college.edu' },
      { name: 'Dr. Suresh Joshi', designation: 'Assistant Professor', specialty: 'Web Development', email: 's.joshi@college.edu' },
      { name: 'Dr. Anita Patil', designation: 'Assistant Professor', specialty: 'Database Systems', email: 'a.patil@college.edu' },
      { name: 'Dr. Ravi Nair', designation: 'Associate Professor', specialty: 'Computer Networks', email: 'r.nair@college.edu' },
      { name: 'Dr. Kavita Desai', designation: 'Assistant Professor', specialty: 'Operating Systems', email: 'k.desai@college.edu' },
    ],
    milestones: [
      { year: 2001, label: 'Department Founded' },
      { year: 2008, label: 'Research Lab Opened' },
      { year: 2015, label: '500 Alumni Milestone' },
      { year: 2020, label: 'AI Research Centre' },
      { year: 2024, label: '1000 Videos on UniCast' },
    ],
  },
  {
    slug: 'it',
    name: 'Information Technology',
    shortName: 'IT',
    icon: Database,
    description: 'Department of Information Technology. Specializing in data management, networking,...',
    fullDescription: 'The IT department focuses on information systems, network administration, cybersecurity, cloud computing, data management, and enterprise software. Students learn to design, implement, and manage large scale information systems used in industry.',
    courses: 10,
    videos: 112,
    members: 280,
    established: 2003,
    head: 'Dr. Priya Nair',
    location: 'Block B, Floor 2',
    email: 'it@college.edu',
    topics: ['Networking', 'Cybersecurity', 'Cloud Computing', 'Data Management', 'Enterprise Systems', 'IoT', 'Blockchain'],
    semesters: [
      {
        sem: 1,
        courses: [
          { code: 'IT101', name: 'Introduction to IT', professor: 'Dr. Nair', videos: 10 },
          { code: 'IT102', name: 'Programming with Python', professor: 'Dr. Kulkarni', videos: 16 },
          { code: 'IT103', name: 'Network Fundamentals', professor: 'Dr. Rao', videos: 12 },
        ]
      },
      {
        sem: 2,
        courses: [
          { code: 'IT201', name: 'Database Systems', professor: 'Dr. Nair', videos: 18 },
          { code: 'IT202', name: 'Web Technologies', professor: 'Dr. Kulkarni', videos: 20 },
          { code: 'IT203', name: 'Cybersecurity Basics', professor: 'Dr. Rao', videos: 14 },
        ]
      },
    ],
    faculty: [
      { name: 'Dr. Priya Nair', designation: 'Head of Department', specialty: 'Cybersecurity', email: 'p.nair@college.edu' },
      { name: 'Dr. Anil Kulkarni', designation: 'Associate Professor', specialty: 'Cloud Computing', email: 'a.kulkarni@college.edu' },
      { name: 'Dr. Meena Rao', designation: 'Assistant Professor', specialty: 'Networking', email: 'm.rao@college.edu' },
      { name: 'Dr. Vikram Shah', designation: 'Assistant Professor', specialty: 'IoT', email: 'v.shah@college.edu' },
    ],
    milestones: [
      { year: 2003, label: 'Department Founded' },
      { year: 2010, label: 'Networking Lab Opened' },
      { year: 2018, label: 'Cybersecurity Centre' },
      { year: 2024, label: '800 Videos on UniCast' },
    ],
  },
  {
    slug: 'aids',
    name: 'Artificial Intelligence and Data Science',
    shortName: 'AIDS',
    icon: Brain,
    description: 'Artificial Intelligence and Data Science. The future of intelligent machines and big data analytics.',
    fullDescription: 'The AIDS department is at the forefront of modern technology. Students explore deep learning, neural networks, natural language processing, computer vision, big data analytics, and statistical modeling. Projects involve real datasets and industry collaboration.',
    courses: 8,
    videos: 94,
    members: 210,
    established: 2019,
    head: 'Dr. Anita Kulkarni',
    location: 'Block C, Floor 1',
    email: 'aids@college.edu',
    topics: ['Deep Learning', 'Neural Networks', 'NLP', 'Computer Vision', 'Big Data', 'Statistics', 'Data Visualization'],
    semesters: [
      {
        sem: 1,
        courses: [
          { code: 'AI101', name: 'Introduction to AI', professor: 'Dr. Kulkarni', videos: 14 },
          { code: 'AI102', name: 'Statistics for Data Science', professor: 'Dr. Verma', videos: 12 },
          { code: 'AI103', name: 'Python for Data Science', professor: 'Dr. Singh', videos: 16 },
        ]
      },
      {
        sem: 2,
        courses: [
          { code: 'AI201', name: 'Machine Learning', professor: 'Dr. Kulkarni', videos: 22 },
          { code: 'AI202', name: 'Data Visualization', professor: 'Dr. Verma', videos: 14 },
          { code: 'AI203', name: 'Neural Networks', professor: 'Dr. Singh', videos: 18 },
        ]
      },
    ],
    faculty: [
      { name: 'Dr. Anita Kulkarni', designation: 'Head of Department', specialty: 'Deep Learning', email: 'a.kulkarni@college.edu' },
      { name: 'Dr. Rahul Verma', designation: 'Associate Professor', specialty: 'Computer Vision', email: 'r.verma@college.edu' },
      { name: 'Dr. Pooja Singh', designation: 'Assistant Professor', specialty: 'NLP', email: 'p.singh@college.edu' },
    ],
    milestones: [
      { year: 2019, label: 'Department Founded' },
      { year: 2021, label: 'AI Research Lab' },
      { year: 2023, label: 'Industry Partnerships' },
      { year: 2024, label: '500 Videos on UniCast' },
    ],
  },
  {
    slug: 'entc',
    name: 'Electronics and Telecommunication',
    shortName: 'ENTC',
    icon: Wifi,
    description: 'Electronics and Telecommunication. Exploring communication systems, VLSI, and signal...',
    fullDescription: 'The ENTC department covers analog and digital electronics, VLSI design, signal processing, communication systems, embedded systems, and microprocessors. Students work on hardware projects and communication protocol design.',
    courses: 14,
    videos: 167,
    members: 295,
    established: 1998,
    head: 'Dr. Suresh Patil',
    location: 'Block D, Floor 2',
    email: 'entc@college.edu',
    topics: ['VLSI', 'Signal Processing', 'Embedded Systems', 'Microprocessors', 'Communication Systems', 'Analog Electronics'],
    semesters: [
      {
        sem: 1,
        courses: [
          { code: 'ET101', name: 'Basic Electronics', professor: 'Dr. Patil', videos: 14 },
          { code: 'ET102', name: 'Circuit Theory', professor: 'Dr. Desai', videos: 12 },
          { code: 'ET103', name: 'Digital Electronics', professor: 'Dr. More', videos: 16 },
        ]
      },
      {
        sem: 2,
        courses: [
          { code: 'ET201', name: 'Analog Circuits', professor: 'Dr. Patil', videos: 18 },
          { code: 'ET202', name: 'Microprocessors', professor: 'Dr. Desai', videos: 20 },
          { code: 'ET203', name: 'Signal Processing', professor: 'Dr. More', videos: 16 },
        ]
      },
    ],
    faculty: [
      { name: 'Dr. Suresh Patil', designation: 'Head of Department', specialty: 'VLSI Design', email: 's.patil@college.edu' },
      { name: 'Dr. Neha Desai', designation: 'Associate Professor', specialty: 'Embedded Systems', email: 'n.desai@college.edu' },
      { name: 'Dr. Ajay More', designation: 'Assistant Professor', specialty: 'Signal Processing', email: 'a.more@college.edu' },
      { name: 'Dr. Smita Joshi', designation: 'Assistant Professor', specialty: 'Communication Systems', email: 's.joshi@college.edu' },
    ],
    milestones: [
      { year: 1998, label: 'Department Founded' },
      { year: 2005, label: 'VLSI Lab Opened' },
      { year: 2012, label: '600 Alumni Milestone' },
      { year: 2019, label: 'Embedded Systems Centre' },
      { year: 2024, label: '1200 Videos on UniCast' },
    ],
  },
  {
    slug: 'electrical',
    name: 'Electrical Engineering',
    shortName: 'ELECTRICAL',
    icon: Zap,
    description: 'Electrical Engineering. Power systems, renewable energy, and control mechanisms.',
    fullDescription: 'The Electrical Engineering department focuses on power systems, electrical machines, control systems, renewable energy, power electronics, and high voltage engineering. Students engage in power grid simulations and green energy projects.',
    courses: 11,
    videos: 130,
    members: 260,
    established: 1995,
    head: 'Dr. Mohan Desai',
    location: 'Block E, Floor 1',
    email: 'electrical@college.edu',
    topics: ['Power Systems', 'Electrical Machines', 'Control Systems', 'Renewable Energy', 'Power Electronics', 'High Voltage'],
    semesters: [
      {
        sem: 1,
        courses: [
          { code: 'EE101', name: 'Electrical Fundamentals', professor: 'Dr. Desai', videos: 12 },
          { code: 'EE102', name: 'Circuit Analysis', professor: 'Dr. Kulkarni', videos: 14 },
          { code: 'EE103', name: 'Engineering Mathematics', professor: 'Dr. Rane', videos: 10 },
        ]
      },
      {
        sem: 2,
        courses: [
          { code: 'EE201', name: 'Electrical Machines', professor: 'Dr. Desai', videos: 18 },
          { code: 'EE202', name: 'Power Systems', professor: 'Dr. Kulkarni', videos: 16 },
          { code: 'EE203', name: 'Control Systems', professor: 'Dr. Rane', videos: 14 },
        ]
      },
    ],
    faculty: [
      { name: 'Dr. Mohan Desai', designation: 'Head of Department', specialty: 'Power Systems', email: 'm.desai@college.edu' },
      { name: 'Dr. Sanjay Kulkarni', designation: 'Associate Professor', specialty: 'Renewable Energy', email: 's.kulkarni@college.edu' },
      { name: 'Dr. Priti Rane', designation: 'Assistant Professor', specialty: 'Control Systems', email: 'p.rane@college.edu' },
      { name: 'Dr. Rakesh Sharma', designation: 'Assistant Professor', specialty: 'Power Electronics', email: 'r.sharma@college.edu' },
    ],
    milestones: [
      { year: 1995, label: 'Department Founded' },
      { year: 2002, label: 'First Research Lab' },
      { year: 2010, label: '500 Alumni Milestone' },
      { year: 2018, label: 'Renewable Energy Lab' },
      { year: 2024, label: '1000 Videos on UniCast' },
    ],
  },
  {
    slug: 'instrumentation',
    name: 'Instrumentation and Control',
    shortName: 'INSTRUMENTATION',
    icon: Settings,
    description: 'Instrumentation and Control. Precision measurements and industrial automation logic.',
    fullDescription: 'The Instrumentation department covers sensors, transducers, industrial automation, process control, PLC programming, SCADA systems, and measurement techniques. Students gain hands-on experience with industry standard equipment.',
    courses: 9,
    videos: 98,
    members: 190,
    established: 2000,
    head: 'Dr. Kavita Joshi',
    location: 'Block F, Floor 2',
    email: 'instrumentation@college.edu',
    topics: ['Sensors', 'PLC Programming', 'SCADA', 'Process Control', 'Industrial Automation', 'Measurement Systems'],
    semesters: [
      {
        sem: 1,
        courses: [
          { code: 'IC101', name: 'Measurement Systems', professor: 'Dr. Joshi', videos: 10 },
          { code: 'IC102', name: 'Sensors and Transducers', professor: 'Dr. Pawar', videos: 12 },
          { code: 'IC103', name: 'Process Control Basics', professor: 'Dr. Shinde', videos: 8 },
        ]
      },
      {
        sem: 2,
        courses: [
          { code: 'IC201', name: 'PLC Programming', professor: 'Dr. Joshi', videos: 16 },
          { code: 'IC202', name: 'SCADA Systems', professor: 'Dr. Pawar', videos: 14 },
          { code: 'IC203', name: 'Industrial Automation', professor: 'Dr. Shinde', videos: 12 },
        ]
      },
    ],
    faculty: [
      { name: 'Dr. Kavita Joshi', designation: 'Head of Department', specialty: 'Process Control', email: 'k.joshi@college.edu' },
      { name: 'Dr. Anil Pawar', designation: 'Associate Professor', specialty: 'PLC Programming', email: 'a.pawar@college.edu' },
      { name: 'Dr. Seema Shinde', designation: 'Assistant Professor', specialty: 'SCADA', email: 's.shinde@college.edu' },
    ],
    milestones: [
      { year: 2000, label: 'Department Founded' },
      { year: 2007, label: 'Automation Lab Opened' },
      { year: 2015, label: 'Industry Collaboration' },
      { year: 2024, label: '600 Videos on UniCast' },
    ],
  },
];
