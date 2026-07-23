import { NextResponse } from 'next/server';
import { mockUsersDb } from '@/lib/recruitment/mockDb';

export async function GET() {
  return NextResponse.json({
    success: true,
    users: mockUsersDb,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser = {
      id: `user_${Date.now()}`,
      name: body.name,
      email: body.email,
      role: body.role || 'RECRUITER',
      status: 'ACTIVE',
      mustChangePassword: true, // Por defecto se exige cambio al iniciar sesión
      tempPassword: body.tempPassword || 'AAcom2026!',
      createdAt: new Date().toISOString(),
    };

    mockUsersDb.push(newUser);

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Usuario creado exitosamente con contraseña temporal obligatoria.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al crear usuario' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, role, resetPassword, newRole } = body;

    const index = mockUsersDb.findIndex((u) => u.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (status) mockUsersDb[index].status = status;
    if (role || newRole) mockUsersDb[index].role = role || newRole;

    if (resetPassword) {
      mockUsersDb[index].mustChangePassword = true;
      mockUsersDb[index].tempPassword = 'ResetPassword2026!';
    }

    return NextResponse.json({
      success: true,
      user: mockUsersDb[index],
      message: resetPassword
        ? 'Contraseña temporal reseteada. El usuario deberá cambiarla en su próximo inicio de sesión.'
        : 'Estado del usuario actualizado correctamente.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}
