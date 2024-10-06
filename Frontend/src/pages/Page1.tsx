import { Box, Text, Select, Container, Center } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { FormData } from '../App';

interface DateSelectorProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Page1: React.FC<DateSelectorProps> = ({ formData, setFormData }) => {
  const granularityOptions = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '6', label: '6 hours' },
    { value: '12', label: '12 hours' },
    { value: '24', label: '1 day' },
  ];

  const handleStartDateChange = (date: Date | null) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      startDate: date ? date.toISOString().split('T')[0] : null,
    }));
  };

  const handleEndDateChange = (date: Date | null) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      endDate: date ? date.toISOString().split('T')[0] : null,
    }));
  };

  const handleGranularityChange = (value: string | null) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      scheduleGranularity: value ? Number(value) : 1,
    }));
  };

  return (
    <Container size="md">
      <Center>
        <Text
          mb={20}
          size="2rem"
          variant="gradient"
          gradient={{ from: 'lime', to: 'cyan', deg: 90 }}
          style={{ fontWeight: 900 }}
        >
          When Is Your Trip?
        </Text>
      </Center>

      <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Box>
          <DateInput
            required
            label="Choose Start Date"
            value={formData.startDate ? new Date(formData.startDate) : null}
            onChange={handleStartDateChange}
            mb="md"
            style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered and smaller
          />
        </Box>

        <Box>
          <DateInput
            required
            label="Choose End Date"
            value={formData.endDate ? new Date(formData.endDate) : null}
            onChange={handleEndDateChange}
            mb="lg"
            style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered and smaller
          />
        </Box>

        <Box>
          <Select
            required
            label="Select Schedule Granularity"
            placeholder="Choose granularity"
            data={granularityOptions}
            value={String(formData.scheduleGranularity)} // Convert number to string for Select
            onChange={handleGranularityChange}
            mb="md"
            style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Page1;
