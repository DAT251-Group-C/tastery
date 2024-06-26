import { PrimeVuePTOptions } from 'primevue/config';
import Avatar from './avatar';
import Badge from './badge';
import Button from './button';
import Chip from './chip';
import DataTable from './datatable';
import Dialog from './dialog';
import Divider from './divider';
import Dropdown from './dropdown';
import IconField from './iconfield';
import InputIcon from './inputicon';
import InputNumber from './inputnumber';
import InputText from './inputtext';
import Menu from './menu';
import OverlayPanel from './overlaypanel';
import TabView from './tabview';
import Tag from './tag';
import Textarea from './textarea';
import Toast from './toast';

const preset: PrimeVuePTOptions = {
  avatar: Avatar,
  badge: Badge,
  button: Button,
  chip: Chip,
  datatable: DataTable,
  dialog: Dialog,
  divider: Divider,
  dropdown: Dropdown,
  // @ts-expect-error - IconField hasnt been added to the PrimeVuePTOptions yet.
  iconfield: IconField,
  inputicon: InputIcon,
  inputnumber: InputNumber,
  inputtext: InputText,
  menu: Menu,
  overlaypanel: OverlayPanel,
  tabview: TabView,
  tag: Tag,
  textarea: Textarea,
  toast: Toast,
};

export default preset;
