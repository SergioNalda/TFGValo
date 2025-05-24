export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  profile_photo?: string | null;
  description?: string;
  // cualquier otro campo que uses
}
