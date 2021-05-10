import { Button } from "@chakra-ui/button";
import { UnlockIcon } from "@chakra-ui/icons";
import { Img } from "@chakra-ui/image";
import {
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";

const ProductDetail = ({ product, controls }) => {
  const { isOpen, onOpen, onClose } = controls;
  const features = product.magentoImages.split(",");
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="#b39573">{product.name}</ModalHeader>
        <ModalCloseButton />
        <Divider w="95%" borderColor="#b39573" mx="auto" mb={2} />

        <ModalBody>
          <Img src="https://via.placeholder.com/400x200" mx="auto" />
          <Divider w="100%" borderColor="#b39573" mx="auto" my={4} />
          <Heading as="h4" size="lg" color="#b39573">
            {product.name}
          </Heading>
          <Text>{product.marketingTagLine}</Text>
          <List>
            <ListItem pb={2}>
              <Heading as="h5" size="md" color="#b39573" pb={2}>
                Pricing
              </Heading>
              <Flex justifyContent="flex-start">
                <Text as="span" pr={8}>
                  Initial payment: ${product.marketingPrice}
                </Text>
                <Text as="span">
                  Recurring: ${product.marketingRecurringPrice}
                </Text>
              </Flex>
            </ListItem>
            <ListItem pb={2}>
              <Heading as="h5" size="md" color="#b39573" pb={2}>
                Features
              </Heading>
              {features.map((f) => (
                <Flex key={f} alignItems="center">
                  <UnlockIcon color="#b39573" mr={4} />
                  <Text as="span">{f}</Text>
                </Flex>
              ))}
            </ListItem>
            <ListItem pb={2}>
              <Heading as="h5" size="md" color="#b39573" pb={2}>
                Description
              </Heading>
              <Text>{product.marketingDescription}</Text>
            </ListItem>
            <ListItem pb={2}>
              <Heading as="h5" size="md" color="#b39573" pb={2}>
                Terms and Conditions
              </Heading>
              <Text>{product.marketingTermsAndConditions}</Text>
            </ListItem>
          </List>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductDetail;
