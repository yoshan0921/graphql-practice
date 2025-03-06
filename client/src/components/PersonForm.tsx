import {useState, useEffect} from 'react';
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
  const [, forceUpdate] = useState({});

  useEffect(() => {
    forceUpdate({});
  }, []);

  const [addPerson] = useMutation(ADD_PERSON, {
    // Appolo Client Cache update
    update(cache, {data}) {
      if (!data?.addPerson) return;

      const existingData = cache.readQuery<{people: Person[]}>({
        query: GET_PEOPLE_WITH_CARS,
      });
      if (!existingData || !existingData.people) return;
      cache.writeQuery({
        query: GET_PEOPLE_WITH_CARS,
        data: {
          people: [...existingData.people, {...data.addPerson, cars: data.addPerson.cars ?? []}],
        },
      });
    },
    onCompleted: () => {
      message.success('Person added successfully');
      form.resetFields();
    },
    onError: error => message.error(`Error: ${error.message}`),
  });

  const [updatePerson] = useMutation(UPDATE_PERSON, {
    onCompleted: () => {
      message.success('Person updated successfully');
      form.resetFields();
      if (onEditComplete) onEditComplete();
    },
    onError: error => message.error(`Error: ${error.message}`),
  });

  const onFinish = (values: Person) => {
    const {firstName, lastName} = values;
    if (person) {
      updatePerson({variables: {id: person.id, firstName, lastName}});
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
        name={person ? 'personEditForm' : 'personAddForm'}
        onFinish={onFinish}
        initialValues={{
          firstName: person?.firstName,
          lastName: person?.lastName,
        }}
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
                  person
                    ? // For update
                      (!form.isFieldTouched('firstName') && !form.isFieldTouched('lastName')) ||
                      form.getFieldsError().filter(({errors}) => errors.length).length > 0
                    : // For add
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
