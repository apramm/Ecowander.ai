import { Box, Title, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { FormData } from '../App';

interface DateSelectorProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Page1: React.FC<DateSelectorProps> = ({ formData, setFormData }) => {
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
      <Title
        order={4}
        mb="lg"
        style={{ textAlign: 'center', color: '#1e88e5' }}
      >
        Select Travel Dates
      </Title>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Box>
          <Text mb="xs" color="#1976d2">
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
          <Text mb="xs" color="#1976d2">
            End Date
          </Text>
          <DatePicker
            value={formData.endDate ? new Date(formData.endDate) : null}
            onChange={handleEndDateChange}
            mb="lg"
            style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered and smaller
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Page1;
