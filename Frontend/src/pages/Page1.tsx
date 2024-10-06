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
    <Container size="md" h="70vh" style={{ overflow: 'auto' }}>
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
          <Text
            mb={20}
            size="1.5rem"
            variant="gradient"
            gradient={{ from: 'teal', to: 'green', deg: 90 }}
            style={{ fontWeight: 600 }}
          >
            Start Date
          </Text>
          <DateInput
            required
            placeholder="2024-04-02"
            value={formData.startDate ? new Date(formData.startDate) : null}
            onChange={handleStartDateChange}
            mb="md"
            size="lg"
          />
        </Box>

        <Box>
          <Text
            mb={20}
            size="1.5rem"
            variant="gradient"
            gradient={{ from: 'teal', to: 'green', deg: 90 }}
            style={{ fontWeight: 600 }}
          >
            End Date
          </Text>
          <DateInput
            required
            placeholder="2024-07-01"
            value={formData.endDate ? new Date(formData.endDate) : null}
            onChange={handleEndDateChange}
            mb="lg"
            size="lg"
          />
        </Box>

        <Box>
          <Text
            mb={20}
            size="1.5rem"
            variant="gradient"
            gradient={{ from: 'teal', to: 'green', deg: 90 }}
            style={{ fontWeight: 600 }}
          >
            Granularity of Schedule
          </Text>
          <Select
            required
            placeholder="1 hour"
            data={granularityOptions}
            value={String(formData.scheduleGranularity)} // Convert number to string for Select
            onChange={handleGranularityChange}
            mb="md"
            size="lg"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Page1;
