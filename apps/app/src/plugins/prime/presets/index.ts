import { PrimeVuePTOptions } from 'primevue/config';
import Avatar from './avatar';
import Badge from './badge';
import Button from './button';
import DataTable from './datatable';
import Dialog from './dialog';
import Divider from './divider';
import Dropdown from './dropdown';
import IconField from './iconfield';
import InputIcon from './inputicon';
import InputText from './inputtext';
import Menu from './menu';
import TabView from './tabview';
import Tag from './tag';
import Toast from './toast';

const preset: PrimeVuePTOptions = {
  avatar: Avatar,
  badge: Badge,
  button: Button,
  datatable: DataTable,
  dialog: Dialog,
  divider: Divider,
  dropdown: Dropdown,
  // @ts-expect-error - IconField hasnt been added to the PrimeVuePTOptions yet.
  iconfield: IconField,
  inputicon: InputIcon,
  inputtext: InputText,
  menu: Menu,
  tabview: TabView,
  tag: Tag,
  toast: Toast,
};

export default preset;
