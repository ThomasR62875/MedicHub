import { getAllUsers, getUser } from "./supabaseLib";
import { supabase } from "../lib/supabase";
const userId= "a98dca0a-a3ae-4954-a147-4b8eb9e0ba31"

jest.mock('../lib/supabase', () => ({
    supabase: {
      rpc: jest.fn(),
    },
}));

describe('getUser', () => {
  it('Obtiene los datos Correctamente', async () => {
      const mockUserData = { first_name: "Fede",last_name:"Botti",dni:"912",age: 30};
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockUserData });

      const result = await getUser(userId);

      expect(result).toEqual(mockUserData);
  });

  it('Resuelve bien los errores', async () => {
      const mockError = new Error('Failed to fetch user');
      (supabase.rpc as jest.Mock).mockResolvedValue({ error: mockError });

      const result = await getUser('user_id');

      expect(result).toBeNull();
  });
});


describe('getAllUsers', () => {
  it('Obtiene los datos Correctamente', async () => {
      const mockUserData = [{ first_name: "Fede",last_name:"Botti",dni:"912",age: 30,},
      {first_name: "Elian",last_name:"Walls",dni:"1812",age:23}
      ];
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockUserData });

      const result = await getAllUsers();

      expect(result).toEqual(mockUserData);
  });

  it('Resuelve bien los errores', async () => {
      const mockError = new Error('Failed to fetch user');
      (supabase.rpc as jest.Mock).mockResolvedValue({ error: mockError });

      const result = await getUser('user_id');

      expect(result).toBeNull();
  });
});


