const errorsByFirebaseCode = {
  'auth/wrong-password': 'Senha incorreta',
  'auth/user-not-found': 'Usuário não encontrado',
  'auth/invalid-email': 'Email inválido',
  'auth/weak-password': 'A senha precisa ter, no mínimo, 6 digitos',
  default: 'Ocorreu algum erro interno, tente novamente',
};

export const getErrorMessage = (code = 'default') => {
  return errorsByFirebaseCode[code] || errorsByFirebaseCode.default;
};
