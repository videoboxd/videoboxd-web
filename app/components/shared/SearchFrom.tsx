import { Form } from 'react-router';
import { Icon } from "@iconify/react";

export default function SearchForm( { searchQuery }: { searchQuery: string } ) {
  return (
    <div className="bg-[#00000080] rounded-full px-6 py-2 max-w-3xl w-full">
      <Form action="?q" className='flex items-center w-full gap-2 text-[#ABB8CE]'>
        <Icon icon="bi:search" className='text-white text-[20px]' />
        <input
          type="search"
          id="q"
          name="q"
          defaultValue={ searchQuery }
          className='text-2xl w-full focus:outline-0'
        />
      </Form>
    </div>
  );
}
