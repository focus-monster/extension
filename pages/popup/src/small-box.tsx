import { Auth } from './auth-button';
import { Character } from './character';
import { FocusAction } from './focus-action';

export function SmallBox() {
  return (
    <div
      className="flex flex-col items-center"
      style={{
        backgroundImage: 'url(/box-sm.png)',
        backgroundSize: 'cover',
        width: '610px',
        height: '270px',
      }}>
      <div className="w-full flex justify-end py-3.5 text-lg px-10">
        <Auth />
      </div>
      <div className="w-full flex flex-col items-center grow pt-6 overflow-hidden">
        <FocusAction />
        <Character />
      </div>
    </div>
  );
}
