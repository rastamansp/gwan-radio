import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@shared/di/container';
import { Session } from '@domain/entities/Session.entity';
import { RescheduleSessionDto } from '@application/dto/RescheduleSessionDto';

export const useRescheduleSession = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Session, Error, RescheduleSessionDto>({
    mutationFn: async (dto) => {
      return container.rescheduleSessionUseCase.execute(sessionId, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'admin'] });
    },
  });
};
