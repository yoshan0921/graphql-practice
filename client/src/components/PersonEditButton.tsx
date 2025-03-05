import {useState} from 'react';
import {Button, Modal} from 'antd';
import {EditOutlined} from '@ant-design/icons';
import PersonForm from './PersonForm';
import type {Person} from '../types';

type Props = {
  person: Person;
};

const PersonEditButton = ({person}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <Button
        type="primary"
        icon={<EditOutlined />}
        style={styles.editButton}
        onClick={() => setIsEditing(true)}
      />
      <Modal
        title="Edit Person"
        width={350}
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}>
        <PersonForm person={person} onEditComplete={() => setIsEditing(false)} />
      </Modal>
    </>
  );
};

export default PersonEditButton;

const styles = {
  editButton: {
    background: 'white',
    color: 'gray',
    boxShadow: 'none',
  },
};
