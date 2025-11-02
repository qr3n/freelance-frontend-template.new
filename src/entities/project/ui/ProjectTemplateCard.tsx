import { DetailedHTMLProps, HTMLAttributes, ReactElement } from 'react';

interface IProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string,
  description: string,
  logo: ReactElement
}

export const ProjectTemplateCard = (props: IProps) => {
  return (
    <div {...props} className='flex gap-3 w-full items-center py-1.5 px-3 rounded-xl bg-black hover:bg-zinc-800 cursor-pointer '>
      {props.logo}
      <div>
        <h1 className='text-sm'>{props.title}</h1>
        <p className='text-zinc-400 text-xs'>{props.description}</p>
      </div>
    </div>
  )
}