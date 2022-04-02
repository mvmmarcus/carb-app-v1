import React from 'react';
import { ScrollView, View, Text } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';

import { theme } from '../../styles/theme';
import { getStyle } from './styles';

const AoutScreen = ({ navigation }) => {
  const { $primary, $secondary } = theme;
  const styles = getStyle({});

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.text}>
            O Cabs é um aplicativo que tem a finalidade de auxiliar pessoas com
            diabetes a manter o controle dos seus índices glicêmicos. Por meio
            da contagem de carboidratos e do valor da glicemia aferida pelo
            usuário, é feito o cálculo da quantidade total de insulina que deve
            ser aplicada para correção.
          </Text>
          <Text style={styles.text}>
            Para os usuários que possuem dispositivos com tecnologia bluetooth
            para aferição da glicemia no sangue, é possível realizar a
            sincronização com o app para obtenção dos dados diretamente do
            dispositivo. Para os que não possuem um dispositivo com essa
            tecnoologia, basta inserir o valor da glicemia manualmente para
            realização dos cálculos de insulina.
          </Text>
          <CustomText weight="bold" style={styles.alert}>
            Avisos importantes
          </CustomText>
          <Text style={{ ...styles.text, fontWeight: 'bold' }}>
            NÃO utilize este software para tomada de decisões médicas; {'\n \n'}
            NÃO nos responsabilizamos por quaisquer problemas relacionados ao
            mal uso deste software; {'\n \n'}
            Qualquer parte do sistema pode falhar a qualquer momento. Sempre
            procure o conselho de um profissional de saúde qualificado para
            qualquer dúvida médica; {'\n \n'}
            Este software não está associado ou endossado por nenhum fabricante
            de equipamento e todas as marcas registradas são de seus respectivos
            proprietários; {'\n \n'}A utilização deste software é inteiramente
            por sua conta e risco. Nenhuma cobrança foi feita pelos
            desenvolvedores pelo uso deste software; {'\n \n'}
            Ao usar este software, você concorda que tem mais de 18 anos de
            idade e leu, entendeu e concorda com todos os itens acima.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AoutScreen;
