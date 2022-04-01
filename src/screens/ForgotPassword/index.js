import React, { useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Snackbar from '../../components/Snackbar';
import IconPerson from '../../../assets/person_outline.svg';
import AuthContext from '../../contexts/auth';
import CustomButtom from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import Input from '../../components/Input';
import { getErrorMessage } from '../../utils/errors';

import { theme } from '../../styles/theme';
import { styles } from './styles';

const CreatePasswordScreen = ({ navigation }) => {
  const { $primary, $secondary, $white, $medium } = theme;
  const [userEmail, setUserEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [formError, setFormError] = useState('');
  const { forgotPassword } = useContext(AuthContext);

  const handleSendForgotPasswordEmail = async (userEmail) => {
    setIsSendingEmail(true);
    try {
      await forgotPassword(userEmail);
    } catch (error) {
      console.log('handleSignin error: ', error?.code);
      setFormError(getErrorMessage(error?.code));
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <Snackbar
        type="error"
        message={formError}
        onDismiss={() => setFormError(null)}
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.titleGroup}>
            <CustomText style={styles.title} weight="bold">
              Redefinir senha
            </CustomText>
            <CustomText style={styles.subTitle} weight="regular">
              Digite seu email abaixo para receber o link de redefinição de
              senha
            </CustomText>
          </View>
          <View style={styles.formGroup}>
            <Input
              label="Email"
              placeholder="Digite seu e-mail"
              iconLabel={<IconPerson />}
              marginBottom={$medium}
              onChange={(email) => !isSendingEmail && setUserEmail(email)}
            />
          </View>
          <View style={styles.buttonGroup}>
            <CustomButtom
              isLoading={isSendingEmail}
              disabled={!userEmail}
              backgroundColor={$secondary}
              color={$white}
              onPress={() => handleSendForgotPasswordEmail(userEmail)}
            >
              {isSendingEmail ? '' : 'Enviar'}
            </CustomButtom>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default CreatePasswordScreen;
