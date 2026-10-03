import type { Icon as TablerIcon, IconProps } from '@tabler/icons-react'

interface IconComponentProps extends IconProps {
  icon: TablerIcon
}

export function Icon({ icon: TablerIconComponent, size = 20, stroke = 1.75, ...props }: IconComponentProps) {
  return <TablerIconComponent size={size} stroke={stroke} {...props} />
}
