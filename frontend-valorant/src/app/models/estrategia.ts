export interface Estrategia {
  is_approved: boolean;
  user: any;
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  video: string;
  agentes?: string[];  // opcional
  mapa?: string;       // opcional
}
