const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
});

const TOPIC_DOM_PREFIX = "topic-";

export const topicDomId = (topicId: string) => `${TOPIC_DOM_PREFIX}${topicId}`;
export const topicIdFromDomId = (domId: string) => domId.replace(TOPIC_DOM_PREFIX, "");
export const formatPostDate = (date: string | Date) => dateFormatter.format(new Date(date));