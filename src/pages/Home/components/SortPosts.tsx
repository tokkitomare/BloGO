import * as Select from "@radix-ui/react-select";
import { localized, type SortOption } from "../constants";
import { Check, ChevronDown } from "lucide-react";

interface SortPostsProps {
    sortBy: SortOption;
    onValueChange: (value: SortOption) => void;
}

export default function SortPosts({ sortBy, onValueChange }: SortPostsProps) {
    return (
        <div className="relative w-fit mb-2 focus:outline-none font-huninn">
            <Select.Root
                value={sortBy}
                onValueChange={(value) => onValueChange(value as SortOption)}
            >
                <Select.Trigger
                    aria-label="Ordenar posts"
                    className="px-4 py-2 rounded-xl bg-glass shadow-glow-3
                            border border-white/30 text-white
                            flex items-center justify-center gap-2
                            cursor-pointer outline-none
                            focus-visible:ring-2 focus-visible:ring-white/30"
                >
                    <Select.Value />
                    <Select.Icon>
                        <ChevronDown
                            size={16}
                            className="transition-transform"
                        />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content
                        position="popper"
                        sideOffset={6}
                        align="start"
                        className="z-50 min-w-45 overflow-hidden
                                rounded-xl border border-white/10
                                bg-gradient-dark shadow-glow-2
                                text-white select-none"
                    >
                        <Select.Group>
                            <Select.Label className="px-4 pt-3 pb-2
                                text-sm text-white/50 text-center">
                                Ordenar por:
                            </Select.Label>

                            <Select.Viewport className="p-1">
                                {Object.entries(localized).map(([key, value]) => (
                                    <Select.Item
                                        key={key}
                                        value={key}
                                        className="relative flex items-center
                                            justify-between gap-4 rounded-md
                                            px-4 py-2 text-sm text-white/80
                                            outline-none cursor-pointer
                                            data-highlighted:bg-white/10
                                            data-highlighted:text-white
                                            data-[state=checked]:text-white"
                                    >
                                        <Select.ItemText>
                                            {value}
                                        </Select.ItemText>

                                        <Select.ItemIndicator>
                                            <Check size={16} />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                ))}
                            </Select.Viewport>
                        </Select.Group>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </div>
    );
}