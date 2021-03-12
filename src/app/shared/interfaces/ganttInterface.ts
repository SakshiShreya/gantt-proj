export interface IProj {
  name: string;
  logo?: { name: string; url: string };
  projManager?: string;
  startDate?: string;
  description?: string;
}

export interface IProjWId extends IProj {
  id: string;
}
