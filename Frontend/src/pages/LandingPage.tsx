import { useState } from 'react';
import {
  Box,
  Select,
  TextInput,
  Title,
  Container,
  Button,
  Divider,
} from '@mantine/core';
import { countries } from './countries';

const countryOptions = countries.map(country => ({
  value: country,
  label: country,
}));

const LandingPage = () => {
  const [selectedCountry1, setSelectedCountry1] = useState<string | null>(null);
  const [city1, setCity1] = useState<string>('');

  const [selectedCountry2, setSelectedCountry2] = useState<string | null>(null);
  const [city2, setCity2] = useState<string>('');

  return (
    <Container size="sm" mt="xl">
      <Title order={2}>Welcome to the Travel Planner</Title>

      <Box mt="md">
        <Title order={4}>Starting Location</Title>
        <Select
          label="Select Starting Country"
          placeholder="Choose a country"
          data={countryOptions}
          value={selectedCountry1}
          onChange={setSelectedCountry1}
          mb="md" // Adds margin to the bottom
        />

        <TextInput
          label="Enter Starting City"
          placeholder="Type your city"
          value={city1}
          onChange={event => setCity1(event.currentTarget.value)}
          mb="lg" // Adds margin to the bottom for spacing
        />

        <Divider my="lg" />

        <Title order={4}>Destination Location</Title>
        <Select
          label="Select Destination Country"
          placeholder="Choose a country"
          data={countryOptions}
          value={selectedCountry2}
          onChange={setSelectedCountry2}
          mb="md"
        />

        <TextInput
          label="Enter Destination City"
          placeholder="Type your city"
          value={city2}
          onChange={event => setCity2(event.currentTarget.value)}
          mb="lg"
        />
      </Box>

      <Button fullWidth mt="md">
        Plan Your Trip
      </Button>
    </Container>
  );
};

export default LandingPage;
