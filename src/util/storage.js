import AsyncStorage from '@react-native-community/async-storage';

export const saveTask = async (data) => {
  try {
    await AsyncStorage.setItem('@Tasks', JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
};

export const loadTask = async () => {
  try {
    return JSON.parse(await AsyncStorage.getItem('@Tasks'));
  } catch (e) {
    console.log(e);
  }
};
