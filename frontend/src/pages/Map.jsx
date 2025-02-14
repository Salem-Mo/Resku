import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';
import Navbar from '../components/Navbar/Navbar';
import MapBox from '../components/Map/MapBox';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error boundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
const Map = () => {
  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <MapBox />
      </ErrorBoundary>
    </>
  );
};
export default Map;
