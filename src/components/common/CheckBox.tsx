import { Icon } from './Icon';

type CheckBoxProps = {
  checked: boolean;
  onChange: () => void;
  prefix?: string;
  label?: string;
  link?: boolean;
  onClick?: () => void;
  isTitle?: boolean;
};

export const CheckBox = ({
  checked,
  onChange,
  label,
  prefix,
  link,
  onClick,
  isTitle = false,
}: CheckBoxProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <label className="relative flex items-center justify-center w-5 h-5">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="peer w-5 h-5 appearance-none rounded-full border-2 border-grayScale-30 transition-colors checked:bg-primary-40 checked:border-primary-40"
          />
          <div className="absolute">
            {checked && <Icon name="white-check" width={16} height={16} alt="하얀체크" />}
          </div>
        </label>
        <p
          className={`${prefix === '(필수)' ? 'text-primary-40' : 'text-grayScale-70'} text-Body2`}
        >
          {prefix}
        </p>
        <p
          className={`${isTitle ? 'text-Body1 text-grayScale-80' : ' text-Body2 text-grayScale-70'}`}
        >
          {label}
        </p>
      </div>
      <div>
        {link && (
          <button className="text-grayScale-50 text-LabelLink underline" onClick={onClick}>
            내용보기
          </button>
        )}
      </div>
    </div>
  );
};
