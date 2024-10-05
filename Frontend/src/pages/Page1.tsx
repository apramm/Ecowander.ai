import { Box, Title, Text, Select } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
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
    <Box
      mt="md"
      p="xl"
      style={{
        border: '1px solid #eaecef',
        borderRadius: '8px',
        backgroundColor: '#e3f2fd', // Light blue background
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
      }}
    >
      <Title order={4} mb="lg" style={{ textAlign: 'center' }}>
        Select Travel Dates
      </Title>

      <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Box>
          <Text mb="xs" c="#1976d2">
            Start Date
          </Text>
          <DatePicker
            value={formData.startDate ? new Date(formData.startDate) : null}
            onChange={handleStartDateChange}
            mb="md"
            style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered and smaller
          />
        </Box>

        <Box>
          <Text mb="xs" c="#1976d2">
            End Date
          </Text>
          <DatePicker
            value={formData.endDate ? new Date(formData.endDate) : null}
            onChange={handleEndDateChange}
            mb="lg"
            style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered and smaller
          />
        </Box>

        <Box>
          <Text mb="xs" c="#1976d2">
            Start Date
          </Text>
          <Select
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
    </Box>
  );
};

export default Page1;
