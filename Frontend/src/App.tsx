import {
  AppShell,
  Burger,
  Center,
  Container,
  Group,
  Text,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useDisclosure } from '@mantine/hooks';

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text size="xl">Ecowander.ai</Text>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Container size="md">
            <Carousel
              withIndicators
              height={800}
              dragFree
              slideGap="lg"
              align="start"
              bg={'red'}
            >
              <Carousel.Slide>Page 1</Carousel.Slide>
              <Carousel.Slide>Page 2</Carousel.Slide>
              <Carousel.Slide>Page 3</Carousel.Slide>
            </Carousel>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
