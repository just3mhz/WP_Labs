from lxml import etree


class XMLDatabase:
    def __init__(self, path_to_db: str):
        self.path_to_db = path_to_db
        self.xml_tree = etree.parse(path_to_db, etree.XMLParser(remove_blank_text=True))
        self.xml_root = self.xml_tree.getroot()

    @staticmethod
    def _extract_record(node):
        record = {'person_id': node.attrib['person_id']}
        for child in node:
            record[child.tag] = child.text
        return record

    def __iter__(self):
        persons = self.xml_root.findall('./person')
        if len(persons) == 0:
            return
        for person in persons:
            yield self._extract_record(person)

    def find(self, person_id):
        node = self.xml_root.find(f'./person[@person_id="{person_id}"]')
        if node is None:
            return None
        return self._extract_record(node)

    def insert(self, record):
        person_id = record['person_id']
        if self.xml_root.find(f'./person[@person_id="{person_id}"]') is not None:
            raise KeyError(f'Duplicated primary key: person_id={person_id}')
        record_node = etree.SubElement(self.xml_root, 'person', person_id=str(person_id))
        for field, value in record.items():
            if field != 'person_id':
                field_node = etree.SubElement(record_node, field)
                field_node.text = str(value)

    def edit(self, person_id, **kwargs):
        node = self.xml_root.find(f'./person[@person_id="{person_id}"]')
        if node is None:
            raise KeyError(f'Invalid primary key: person_id={person_id}')
        for field, value in kwargs.items():
            sub_node = node.find(f'./{field}')
            if sub_node is not None:
                sub_node.text = str(value)

    def delete(self, person_id):
        node = self.xml_root.find(f'./person[@person_id="{person_id}"]')
        if node is not None:
            self.xml_root.remove(node)

    def display(self):
        for record_node in self.xml_root:
            person_id = record_node.attrib['person_id']
            fields = ', '.join(f'{child.tag}=\'{child.text}\'' for child in record_node)
            print(f'{person_id}: {fields}')

    def dumps(self):
        return etree.tostring(self.xml_tree, pretty_print=True)

    def dump(self):
        self.xml_tree.write(self.path_to_db, pretty_print=True, encoding='UTF-8')
