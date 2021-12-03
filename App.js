/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {
  NativeModules,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

var Aes = NativeModules.Aes;

const generateKey = (password, salt, cost, length) =>
  Aes.pbkdf2(password, salt, cost, length);

const encrypt = (text, key) => {
  return Aes.randomKey(16).then(iv => {
    return Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
      cipher,
      iv,
    }));
  });
};
const decrypt = async (encryptedData, key) => {
  console.log({encryptedData, key});
  return Aes.decrypt(
    encryptedData.cipher,
    key,
    encryptedData.iv,
    'aes-256-cbc',
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [data, setData] = useState({});
  const [dec, setDec] = useState('');

  const getData = async () => {
    generateKey('Arnold', 'salt', 5000, 256).then(key => {
      console.log('Key:', key);
      encrypt('These violent delights have violent ends', key)
        .then(({cipher, iv}) => {
          console.log('Encrypted:', cipher);
          setData({cipher, iv, key});
        })
        .catch(error => {
          console.error(error);
        });
    });
  };

  const getDec = async () => {
    var {cipher, key, iv} = data;
    decrypt({cipher, iv}, key).then(decrypted => {
      console.log({decrypted});
      setDec(decrypted);
    });
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text style={styles.sectionDescription}>key: {data.key}</Text>
          <Text style={styles.sectionDescription}>cipher: {data.cipher}</Text>
          <Text style={styles.sectionDescription}>iv: {data.iv}</Text>
          <Text style={styles.sectionDescription}>Decrypted: {dec}</Text>
          <TouchableOpacity onPress={() => getData()}>
            <Text style={styles.button}>Encrypt</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getDec()}>
            <Text style={styles.button}>Decrypt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    paddingHorizontal: 10,
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    textDecorationLine: 'underline',
    padding: 20,
    textAlign: 'center',
  },
});

export default App;
