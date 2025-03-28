import {Alert, Button, Group, Modal, Stack} from '@mantine/core';

interface Props {
    opened: boolean;
    text: string,
    close: () => void;
    onOk: any;
}

export default function ConfirmModal({opened, close, onOk, text}: Props) {

    function onOkClick() {
        onOk();
        close();
    }

    return (
        <Modal opened={opened} onClose={close} withCloseButton={false}>
            <Alert color="red">
                <Stack>
                    {text}
                    <Group>
                        <Button variant="danger" onClick={onOkClick}>Ok</Button>
                        <Button variant="outline" onClick={close}>Cancel</Button>
                    </Group>
                </Stack>
            </Alert>
        </Modal>

    );
}