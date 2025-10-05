import { ChatBubbleIcon, HomeIcon } from '@radix-ui/react-icons';
import { Avatar, Box, Flex, Heading, IconButton, ScrollArea, Section } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';

// const IndexComponent: FC = () => {
//   const { user } = useStore();
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   if (user != null) {
//     navigate({ to: '/rooms' });
//     return null;
//   }

//   return (
//     <>
//       <Box display="flex" justifyContent="center">
//         <Box flexDirection="column">
//           <Box>Le Chat Rooms</Box>
//           <Box>
//             <Button
//               onClick={() => {
//                 setOpen(true);
//               }}
//             >
//               Login
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//       <LoginDialog open={open} setOpen={setOpen} />
//     </>
//   );
// };

const IndexComponent: FC = () => {
  return (
    <Flex>
      <Flex align="center" data-tab-rail direction="column" gap="3" width="70px">
        <Box>
          <Avatar fallback="S" />
        </Box>
        <Box>
          <IconButton>
            <HomeIcon />
          </IconButton>
        </Box>
        <Box>
          <IconButton>
            <ChatBubbleIcon />
          </IconButton>
        </Box>
      </Flex>
      <Box data-channel-list width="360px">
        <ScrollArea>Sidebar</ScrollArea>
      </Box>
      <Flex maxWidth="100%">
        <Section>
          <Heading>Hello, World!</Heading>
        </Section>
      </Flex>
    </Flex>
  );
};

export const Route = createFileRoute('/')({
  component: IndexComponent,
});
