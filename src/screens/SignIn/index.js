import React, { useContext } from 'react';

import BluetoothContext from '../../contexts/bluetooth';

import { SafeArea, Container } from './styles';

const SignInScreeen = () => {
  const {} = useContext(BluetoothContext);

  return (
    <SafeArea>
      <Container>Sign In</Container>
    </SafeArea>
  );
};

export default SignInScreeen;
