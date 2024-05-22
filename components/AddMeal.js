import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import { db } from './firebaseConfig';

const AddMeal = ({ navigation, route }) => {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);

  /*const handleAddMeal = () => {
    if (food && calories > 0) {
      const newMeal = { food, calories };
      const { addMeal } = route.params; // addMeal을 여기서 가져옴 -> Home으로 보내야함함
      addMeal(newMeal); // AddMeal에서 전달된 함수를 호출하여 식사를 추가합니다.
      setFood('');
      setCalories(0);
      navigation.goBack(); // 식사를 추가한 후 홈 화면으로 돌아갑니다.
    }
  };*/

  //db 부분 날짜별로
  const handleAddMeal = async () => {
    if (food && calories && parseInt(calories) > 0) {
      const newMeal = { food, calories };

      try {
        const currentDate = new Date().toISOString().split('T')[0];
        const collectionName = `meals_${currentDate}`;

        // Firestore에 식사를 추가하고 문서(ID)를 반환받습니다.
        const mealRef = await db.collection(collectionName).add({
          food: food,
          calories: parseInt(calories),
          createdAt: new Date(),
        });

        // mealRef.id를 이용하여 추가한 식사의 ID를 얻습니다.
        const mealId = mealRef.id;

        if (route.params && route.params.addMeal) {
          // 새로운 식사 정보에 ID를 추가한 후 Home으로 전달합니다.
          route.params.addMeal({ ...newMeal, id: mealId });
        }

        setTotalCalories(totalCalories + parseInt(calories));
        setFood('');
        setCalories('');
        navigation.goBack();
      } catch (error) {
        console.error('식사 추가 중 오류 발생: ', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>식사 추가</Text>
      <TextInput
        style={styles.input}
        placeholder="음식 이름"
        value={food}
        onChangeText={(text) => setFood(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="칼로리"
        keyboardType="numeric"
        value={calories.toString()}
        onChangeText={(text) => setCalories(parseInt(text))}
      />
      <Button title="식사 추가" onPress={handleAddMeal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8, // paddingHor -> paddingHorizontal로 수정
  },
});

export default AddMeal;
