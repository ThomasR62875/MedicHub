
import { BrowserRouter, Routes, Route, Link } from "react-native"

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Home from "./src/pages/Home"
import Create from "./src/pages/Create"
// import Update from "./src/pages/Update"


function App() {
  return (
      <BrowserRouter style={styles.container}>
        <nav>
          <h1>Supa Smoothies</h1>
          <Link to="/">Home</Link>
          <Link to="/create">Create New Smoothie</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          {/*<Route path="/:id" element={<Update />} />*/}
        </Routes>
      </BrowserRouter>
    //   <View style={styles.container}>
    //   <Text>a</Text>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;