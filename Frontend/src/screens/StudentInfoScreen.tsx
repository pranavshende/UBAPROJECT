import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const StudentInfoScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [department, setDepartment] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim() || !roll.trim() || !department.trim()) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    setResult(
      `Student Name: ${name}\nRoll Number: ${roll}\nDepartment: ${department}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Student Information</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Student Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Roll Number"
        value={roll}
        onChangeText={setRoll}
        keyboardType="number-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Department"
        value={department}
        onChangeText={setDepartment}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {result && <Text style={styles.result}>{result}</Text>}
    </View>
  );
};

export default StudentInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  result: {
    marginTop: 20,
    fontSize: 16,
  },
});
