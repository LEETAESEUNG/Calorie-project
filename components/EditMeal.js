import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';

const EditMeal = ({ navigation, route }) => {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);

  // route.params를 통해 전달된 식사 정보를 가져와서 state를 초기화합니다.
  useEffect(() => {
    if (route.params?.meal) {
      setFood(route.params.meal.food);
      setCalories(route.params.meal.calories.toString());
    }
  }, [route.params]);


  // Firestore에서 식사를 업데이트하는 함수입니다.
 const handleUpdateMeal = async () => {
    if (food && calories && parseInt(calories) > 0) {
      // `food`와 `calorie`로 필드 이름을 변경합니다.
      const updatedMeal = { food: food, calories: parseInt(calories) };

      try {
        const currentDate = new Date().toISOString().split('T')[0];
        const collectionName = `meals_${currentDate}`;
        const mealId = route.params.meal.id; // 기존 식사의 ID를 가져옵니다.

        // Firestore에서 해당 ID의 식사 문서를 업데이트합니다.
        await db.collection(collectionName).doc(mealId).update(updatedMeal);

        console.log('파이어베이스 업데이트 완료');

        if (route.params) {
          console.log('route.params:', route.params);
          if (route.params.editMeal) {
            console.log('Home으로 데이터 전달 시도...');
            route.params.editMeal({ ...updatedMeal, id: mealId });
            console.log('Home으로 데이터 전달 완료!');
          } else {
            console.log('route.params.editMeal 함수가 없습니다.');
          }
        } else {
          console.log('route.params가 없습니다.');
        }
        setTotalCalories(totalCalories + parseInt(calories));
        navigation.goBack();
      } catch (error) {
        console.error('식사 업데이트 중 오류 발생: ', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>식사 수정</Text>
      <TextInput
        style={styles.input}
        placeholder="음식 이름"
        value={food}
        onChangeText={setFood}
      />
      <TextInput
        style={styles.input}
        placeholder="칼로리"
        keyboardType="numeric"
        value={calories}
        onChangeText={(text) => setCalories(text)} // parseInt를 여기서 하지 않습니다.
      />
      <Button title="변경 사항 저장" onPress={handleUpdateMeal} />
    </View>
  );
}

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

export default EditMeal;