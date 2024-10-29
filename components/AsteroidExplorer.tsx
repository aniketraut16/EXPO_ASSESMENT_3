import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

const AsteroidExplorer: React.FC = () => {
  const [asteroidId, setAsteroidId] = useState<string>("");
  const [asteroidData, setAsteroidData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const NASA_API_KEY = process.env.NASA_API_KEY;

  const fetchAsteroidData = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${NASA_API_KEY}`
      );
      setAsteroidData(response.data);
    } catch (error) {
      setError("Failed to fetch asteroid data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    fetchAsteroidData(asteroidId);
  };

  const fetchRandomAsteroid = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${NASA_API_KEY}`
      );
      const randomAsteroidId = response.data.near_earth_objects[0].id;
      fetchAsteroidData(randomAsteroidId);
    } catch (error) {
      setError("Failed to fetch random asteroid. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search Here"
          value={asteroidId}
          onChangeText={setAsteroidId}
        />
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={asteroidId.trim() === ""}
        />
      </View>
      <Button title="Random Asteroid" onPress={fetchRandomAsteroid} />
      {isLoading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : asteroidData ? (
        <View style={styles.infoContainer}>
          <Text style={styles.name}>Name: {asteroidData.name}</Text>
          <Text style={styles.info}>
            NASA JPL URL: {asteroidData.nasa_jpl_url}
          </Text>
          <Text style={styles.info}>
            Is Potentially Hazardous Asteroid:{" "}
            {asteroidData.is_potentially_hazardous_asteroid ? "Yes" : "No"}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
  },
  infoContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  loading: {
    fontSize: 16,
    marginTop: 20,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 20,
  },
});

export default AsteroidExplorer;
