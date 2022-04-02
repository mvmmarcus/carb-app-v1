const errorsByFirebaseCode = {
  'auth/wrong-password': 'Senha incorreta',
  'auth/user-not-found': 'Usuário não encontrado',
  'auth/invalid-email': 'Email inválido',
  'auth/weak-password': 'A senha precisa ter, no mínimo, 6 digitos',
  'auth/email-already-in-use': 'Já existe um usuário com este email',
  'auth/requires-recent-login': 'Esta operação requer uma autenticação recente',
  default: 'Ocorreu algum erro interno, tente novamente',
};

export const getErrorMessage = (code = 'default') => {
  return errorsByFirebaseCode[code] || errorsByFirebaseCode.default;
};
