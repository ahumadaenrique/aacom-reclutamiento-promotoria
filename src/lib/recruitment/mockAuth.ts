export interface RecruitmentUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE';
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  mustChangePassword: boolean;
}

// Simulador de sesión actual (Fácilmente reemplazable por NextAuth / getCurrentUser real)
let currentMockUser: RecruitmentUser = {
  id: "user_admin_001",
  name: "Director de Promotoría AACOM",
  email: "admin@aacom.com",
  role: "ADMIN",
  status: "ACTIVE",
  mustChangePassword: false,
};

export const getMockUser = (): RecruitmentUser => {
  return currentMockUser;
};

export const setMockUser = (user: RecruitmentUser): void => {
  currentMockUser = user;
};

export const getCurrentUser = (): RecruitmentUser => {
  return getMockUser();
};
