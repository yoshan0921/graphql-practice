import {useEffect} from 'react';
import {useMutation} from '@apollo/client';
import {Form, Input, Button, message} from 'antd';
import {ADD_PERSON, UPDATE_PERSON} from '../graphql/mutations';
import {GET_PEOPLE_WITH_CARS} from '../graphql/queries';
import type {Person} from '../types';

type Props = {
  person?: Person;
  onEditComplete?: () => void;
};

const PersonForm = ({person, onEditComplete}: Props) => {
  const [form] = Form.useForm();
  const [, contextHolder] = message.useMessage();

  const [addPerson] = useMutation(ADD_PERSON, {
    refetchQueries: [{query: GET_PEOPLE_WITH_CARS}],
    onCompleted: () => {
      message.success('Person added successfully');
      form.resetFields();
    },
    onError: error => message.error(`Error: ${error.message}`),
  });

  const [updatePerson] = useMutation(UPDATE_PERSON, {
    refetchQueries: [{query: GET_PEOPLE_WITH_CARS}],
    onCompleted: () => {
      message.success('Person updated successfully');
      if (onEditComplete) onEditComplete();
    },
    onError: error => message.error(`Error: ${error.message}`),
  });

  useEffect(() => {
    if (person) {
      form.setFieldsValue({
        firstName: person.firstName,
        lastName: person.lastName,
      });
    }
  }, [person, form]);

  const onFinish = (values: {firstName: string; lastName: string}) => {
    if (person) {
      updatePerson({variables: {id: person.id, ...values}});
    } else {
      addPerson({variables: {...values}});
      form.resetFields();
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        onFinish={onFinish}
        layout={person ? 'horizontal' : 'inline'}
        style={styles.form}>
        <Form.Item
          name="firstName"
          label="First Name"
          style={styles.formItem}
          rules={[{required: true, message: 'Enter first name'}]}>
          <Input placeholder="First Name" style={styles.inputNormal} />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          style={styles.formItem}
          rules={[{required: true, message: 'Enter last name'}]}>
          <Input placeholder="Last Name" style={styles.inputNormal} />
        </Form.Item>
        <Form.Item style={styles.formItem} shouldUpdate={true}>
          {() => (
            <>
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().filter(({errors}) => errors.length).length > 0
                }>
                {person ? 'Update Person' : 'Add Person'}
              </Button>
              {person && (
                <Button onClick={onEditComplete} style={styles.cancelButton}>
                  Cancel
                </Button>
              )}
            </>
          )}
        </Form.Item>
      </Form>
    </>
  );
};

export default PersonForm;

const styles = {
  form: {
    justifyContent: 'center' as const,
  },
  formItem: {
    marginBottom: 10,
  },
  inputXSmall: {
    width: 60,
    textAlign: 'left' as const,
    marginBottom: 10,
  },
  inputSmall: {
    width: 90,
    textAlign: 'left' as const,
    marginBottom: 10,
  },
  inputNormal: {
    width: 150,
    textAlign: 'left' as const,
    marginBottom: 10,
  },
  cancelButton: {
    marginLeft: 10,
  },
};
