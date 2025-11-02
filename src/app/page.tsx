import { UniversalToggleButton } from '@app/Editor';
import { CreateProjectModal } from '@widgets/create-project-modal/ui/CreateProjectModal';
import { Button } from '@shared/shadcn/ui/button';

export default async function Home() {
  return (
    <div className='m-24 flex'>
      <UniversalToggleButton className='w-[150px]' fixedWidth={false} initialText={'Create project'} toggledText={'Done!'}/>
      <CreateProjectModal trigger={<Button>Create project</Button>}/>
    </div>
  );
}
