import { ChangeEvent, useRef, useState } from "react";
import { useEffectOnce } from "../hooks/useEffectOnce";

export interface DropdownItem {
  label: string;
  id: string;
}

export interface DropdownProps {
  items: DropdownItem[];
  on_item_changed?: (item: DropdownItem) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ items, on_item_changed = null }) => {
  const [current_item, set_current_item] = useState<DropdownItem | null>(items[0]);
  const [show_list, set_show_list] = useState<boolean>(false);
  const [lookup_value, set_lookup_value] = useState<string>("");
  
  const dropdown_ref = useRef<HTMLDivElement>(null);
  const dropdown_open = useRef<boolean>(false);

  useEffectOnce(() => {
    const close_dropdown = (e: MouseEvent) => {
      if (e.target) {
        if (dropdown_open.current && !dropdown_ref.current?.contains(e.target as Node)) {
          set_show_list(false);
        }
      }
    };

    document.addEventListener('mousedown', close_dropdown);

    return () => {
      document.removeEventListener('mousedown', close_dropdown);
    };
  }, [])

  function toggle_list() {
    set_show_list(!show_list);
    dropdown_open.current = !show_list;
  }

  function select_item(item: DropdownItem) {
    set_current_item(item);
    if (on_item_changed) on_item_changed(item);
    set_show_list(false);
    set_lookup_value("");
    dropdown_open.current = false;
  }

  function lookup_change(e: ChangeEvent<HTMLInputElement>) {
    set_lookup_value(e.target.value.toLowerCase());
  }

  return (
    <div ref={dropdown_ref}>
      {!show_list && 
      <button className="bg-cscol-400 text-cscol-100 hover:bg-cscol-500 shadow-md w-full h-full p-2 rounded-sm" onClick={toggle_list}>
        {current_item && current_item.label}
        {!current_item && "Choose Option"}
      </button>}
      {show_list && 
      <input className="text-cscol-500 shadow-md p-2 outline-none focus:border-cscol-500 border-2" placeholder={current_item?.label} onChange={lookup_change} autoFocus />}
      <div className={`${!show_list && 'hidden'} absolute flex shadow-md`}>
        <ol className="flex flex-col w-full max-h-96 overflow-y-auto bg-cscol-400 rounded-sm">
          {items.map(item => {
            if (!item.label.toLowerCase().includes(lookup_value)) {
              return;
            }

            return (
              <li
                key={item.id}
                className={`p-2 cursor-pointer ${item.label == current_item?.label && 'bg-cscol-200'} hover:bg-cscol-300`} 
                onClick={() => select_item(item)}
              >
                {item.label}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  )
}

export default Dropdown;