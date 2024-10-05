import {
  AppShell,
  Burger,
  Button,
  Center,
  Container,
  Group,
  Text,
  Image,
} from '@mantine/core';
import LandingPage from './pages/LandingPage';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import logo from '../images/logo.png';
import { form } from 'framer-motion/client';

export interface FormData {
  startLocation: string; // e.g. "Paris, France" (city, country)
  endLocation: string; // e.g. "New York, United States" (city, country)
  startDate: string | null; // e.g. 2024-02-27
  endDate: string | null;
  budgetInDollars: number; // e.g. 3323233
  numberOfPeople: number;
  scheduleGranularity: number; // 1, 4, 8, 24 (i.e. 1 hour, 4 hours, 8 hours, 24 hours)
  mustSeeAttractions: string[];
  additionalInfo: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [opened, { toggle }] = useDisclosure();
  const [formData, setFormData] = useState<FormData>({
    startLocation: ',',
    endLocation: ',', // e.g. "New York,United States" (city, country)
    startDate: '', // e.g. 2024-02-27
    endDate: '',
    budgetInDollars: 0, // e.g. 3323233
    numberOfPeople: 0,
    scheduleGranularity: 0, // 1, 4, 8, 24 (i.e. 1 hour, 4 hours, 8 hours, 24 hours)
    mustSeeAttractions: [],
    additionalInfo: '',
  });

  const steps = [
    {
      id: 1,
      content: 'Step 1',
      component: <LandingPage formData={formData} setFormData={setFormData} />,
    },
    {
      id: 2,
      content: 'Step 2',
      component: <Page1 formData={formData} setFormData={setFormData} />,
    },
    {
      id: 3,
      content: 'Step 3',
      component: <Page2 formData={formData} setFormData={setFormData} />,
    },
  ];

  console.log(formData);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const variants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/generate-trip',
        formData
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <AppShell header={{ height: 80 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Image
              src={logo}
              alt="Ecowander Logo"
              width={400}
              height={200}
              style={{
                objectFit: 'contain',
                marginTop: '-4rem',
                marginLeft: '2rem',
              }}
            />
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Container size="md">
            <motion.div
              key={currentStep}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.5 }}
            >
              {steps[currentStep].component}
            </motion.div>

            <Center mt="md">
              <Group>
                <Button
                  variant="default"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                >
                  Next
                </Button>
                <Button onClick={handleSubmit}>Submit</Button>
              </Group>
            </Center>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
