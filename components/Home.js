import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import { db } from './firebaseConfig';

const Home = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [mealLogs, setMealLogs] = useState({}); // 날짜별로 식사 기록 관리
  const [totalCalories, setTotalCalories] = useState(0);
  const [dailyCalories, setDailyCalories] = useState(1303); // 일일 칼로리 상태 변수
  const [calorieExceeded, setCalorieExceeded] = useState(false); // 칼로리 초과 여부 상태 변수

  // useEffect를 사용하여 날짜가 변경될 때마다 해당 날짜의 데이터를 가져옵니다.
  useEffect(() => {
    console.log("mealLogs 변경 감지:", mealLogs);
    console.log("mealLogs 상태 변경됨:", mealLogs);
    if (mealLogs[selectedDate] !== undefined) {
      const selectedLogs = mealLogs[selectedDate];
      const dailyCaloriesConsumed = selectedLogs.reduce(
        (acc, meal) => acc + meal.calories,
        0
      );
      if (dailyCaloriesConsumed > dailyCalories) {
        setCalorieExceeded(true);
      } else {
        setCalorieExceeded(false);
      }
      setTotalCalories(dailyCaloriesConsumed); // "총 칼로리" 업데이트
    } else {
      setCalorieExceeded(false);
      setTotalCalories(0); // 선택한 날짜에 식사 기록이 없으면 총 칼로리를 0으로 설정
    }
  }, [mealLogs, selectedDate, dailyCalories]);

  const onDayPress = (day) => {
    // 캘린더에서 날짜를 선택했을 때 실행되는 함수
    setSelectedDate(day.dateString);
  };

  //AddMeal 정보를 가져오긴위한 함수
  const addMeal = (newMeal) => {
    const updatedLogs = { ...mealLogs };
    if (updatedLogs[selectedDate] === undefined) {
      updatedLogs[selectedDate] = [];
    }
    updatedLogs[selectedDate].push(newMeal);
    setMealLogs(updatedLogs);
  };

  //수정기능 EditMeal에서 바꾸고 업데이트하는 함수
  const editMeal = (index, updatedMeal) => {
    console.log("editMeal 함수 호출됨", index, updatedMeal);
    const updatedLogs = { ...mealLogs };
    updatedLogs[selectedDate][index] = updatedMeal;
    setMealLogs(updatedLogs);
    console.log("업데이트 된 mealLogs: ", updatedLogs);
    console.log("selectedDate, index 값: ", selectedDate, index);
  };

  //삭제 함수
  const deleteMeal = async (index, mealId) => {
    const updatedLogs = { ...mealLogs };
    updatedLogs[selectedDate].splice(index, 1);

    try {
      // Firestore에서 해당 식사 항목 삭제
      const collectionName = `meals_${selectedDate}`;
      await db.collection(collectionName).doc(mealId).delete();

      setMealLogs(updatedLogs);
    } catch (error) {
      console.error('식사 삭제 중 오류 발생: ', error);
    }
  };

  console.log("mealLogs 렌더링:", mealLogs);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>칼로리 계산 앱</Text>
      <Calendar
        onDayPress={onDayPress}
        current={selectedDate} // 현재 날짜를 `selectedDate`로 설정
        hideExtraDays
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'blue' },
        }}
      />
      <Text style={styles.date}>선택한 날짜: {selectedDate}</Text>
      <Text style={styles.dailyCalories}>
        일일 칼로리 목표: {dailyCalories} kcal
      </Text>
      <Button
        title="식사 추가"
        onPress={() => navigation.navigate('AddMeal', { addMeal })}
      />
      <Text style={styles.totalCalories}>총 칼로리: {totalCalories} kcal</Text>
      {/* 공백 추가 */}
      <View style={{ marginBottom: 8 }}></View>
      <Text style={styles.mealLogHeader}>식사 기록</Text>
      {/* 공백 추가 */}
      <View style={{ marginBottom: 8 }}></View>
      {mealLogs[selectedDate] &&
        mealLogs[selectedDate].map((meal, index) => (
          <View key={index} style={styles.mealLogItem}>
            <Text>{meal.food}</Text>
            <Text>{meal.calories} kcal</Text>
           <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditMeal', {
                  meal,
                  editMeal: (updatedMeal) => editMeal(index, updatedMeal) // editMeal을 updateMeal로 변경
                })
              }
              style={styles.editButton}>
              <Text style={{ color: 'white' }}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteMeal(index, meal.id)} // mealId 전달
              style={styles.deleteButton}>
              <Text style={{ color: 'white' }}>삭제</Text>
            </TouchableOpacity>
          </View>
        ))}
      {calorieExceeded && (
        <Text style={styles.calorieExceededMessage}>
          일일 칼로리를 초과했습니다!
        </Text>
      )}
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
  date: {
    fontSize: 18,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#22b8cf',
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
    width: 40,
    position: 'absolute', // 절대 위치로 설정
    right: 48, // 수정 버튼 오른쪽에 배치
    top: 0, // 위에 배치
  },
  deleteButton: {
    backgroundColor: 'red', // 삭제 버튼의 배경색
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
    width: 40,
    position: 'absolute', // 절대 위치로 설정
    right: 0, // 수정 버튼과 겹치게 배치
    top: 0, // 위에 배치
  },
  dailyCalories: {
    fontSize: 18,
    marginBottom: 8,
    color: 'gray',
    textAlign: 'center', // 가운데 정렬
  },
  calorieExceededMessage: {
    fontSize: 16,
    color: 'red',
    marginTop: 8,
    textAlign: 'center', // 가운데 정렬
  },
});

export default Home;
