
export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  contact: {
    email: string;
    linkedin: string;
    whatsapp: string;
    location: string;
  };
}
